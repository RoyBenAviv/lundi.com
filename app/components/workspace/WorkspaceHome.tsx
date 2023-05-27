'use client'
import useOnClickOutside from '@/app/hooks/useOnClickOutside'
import { useGetWorkspace, useUpdateBoard, useUpdateWorkspace } from '@/app/hooks/useQuery'
import { backgrounds, colors } from '@/app/services/utilService'
const { Button, TabList, TabPanel, TabPanels, TabsContext, Tab } = require('monday-ui-react-core')
import { useRouter } from 'next/navigation'
import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
const { Edit, Favorite, Board, Check, Upload } = require('monday-ui-react-core/icons')
import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
  accessKeyId: 'AKIARR545QGXMGZBNQDL',
  secretAccessKey: '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',
  region: 'eu-west-1'
})

export default function WorkspaceHome({ workspace }: { workspace: Workspace }) {
  const { data: currentWorkspace } = useGetWorkspace(workspace)
  console.log('file: WorkspaceHome.tsx:20 -> currentWorkspace:', currentWorkspace)
  const { mutate: updateMutate } = useUpdateWorkspace()
  const { mutate: updateMutateBoard } = useUpdateBoard()
  const editWorkspaceIconRef = useRef(null)
  const editWorkspaceBackgroundRef = useRef(null)
  const router = useRouter()

  const [isOpenEditIcon, setIsOpenEditIcon] = useState<boolean>(false)
  const [isOpenEditBackground, setIsOpenEditBackground] = useState<boolean>(false)

  const handleChange = (value: string, key: string) => {
    if (value === currentWorkspace[key as keyof Workspace]) return
    updateMutate({ workspaceId: currentWorkspace.id!, value, key })
  }

  useOnClickOutside(editWorkspaceIconRef, () => setIsOpenEditIcon(false))
  useOnClickOutside(editWorkspaceBackgroundRef, () => setIsOpenEditBackground(false))

  const onNavigateBoard = (board: Board) => {
    router.push(`/workspaces/${board.workspaceId}/boards/${board.id}`)
    updateMutateBoard({ boardId: board.id!, value: new Date(), key: 'recentlyVisited' })
  }

  const sortedBoardsByRecentlyVisited = useMemo(
    () =>
      currentWorkspace.boards?.sort((board1: Board, board2: Board) => {
        const time1 = board1?.recentlyVisited ? new Date(board1?.recentlyVisited).getTime() : 0
        const time2 = board2?.recentlyVisited ? new Date(board2?.recentlyVisited).getTime() : 0

        return time2 - time1
      }),
    [currentWorkspace.boards]
  )

  const handleFileInputChange = async (event: any) => {
    const params = {
      Bucket: 'lundi',
      Key: 'backgrounds/' + event.target.files[0].name,
      Body: event.target.files[0],
      ACL: 'public-read',
    }
    try {
      await s3.upload(params).promise()
      handleChange(`https://lundi.s3.amazonaws.com/backgrounds/${event.target.files[0].name}`, 'background')
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <main className="workspace-home">
      <header ref={editWorkspaceBackgroundRef} style={{ backgroundImage: currentWorkspace.background?.includes('lundi') ? `url("${currentWorkspace.background}")` : `url("https://cdn.monday.com/images/workspaces_cover_photos/full/${currentWorkspace.background}")` }} className="cover-image">
        <Button className="change-cover-btn" style={isOpenEditBackground ? { opacity: 1 } : {}} onClick={() => setIsOpenEditBackground((isOpenEditBackground) => !isOpenEditBackground)}>
          <Edit /> Change Cover
        </Button>
        {
          <CSSTransition timeout={150} in={isOpenEditBackground} classNames="container-transition">
            <>
              {isOpenEditBackground && (
                <div className="edit-workspace-background">
                  <header className="edit-workspace-background-header">
                    <p className="mini-paragraph">Images</p>

                    <div className="upload-container">
                      <label htmlFor="fileUpload" className="upload-button">
                        <Button size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY} leftIcon={Upload}>
                          Upload your own
                        </Button>
                        <input accept="image/*" type="file" id="fileUpload" onChange={(e) => handleFileInputChange(e)} />
                      </label>
                    </div>
                  </header>
                  <div className="backgrounds-container">
                    {backgrounds.map((background: string) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        style={background === currentWorkspace.background ? { boxShadow: '0 0 0 2px var(--primary-background-color),0 0 0 4px var(--primary-color)' } : {}}
                        onClick={() => handleChange(background, 'background')}
                        width={100}
                        height={45}
                        key={background}
                        src={`https://cdn.monday.com/images/workspaces_cover_photos/thumbnail/${background}`}
                        alt="thumbnail-background"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          </CSSTransition>
        }
      </header>
      <section ref={editWorkspaceIconRef} className="workspace-details">
        <div onClick={() => setIsOpenEditIcon((isOpenEditIcon) => !isOpenEditIcon)} className="workspace-icon" style={{ backgroundColor: currentWorkspace.color }}>
          {currentWorkspace.name[0]}
          <span>
            <Edit />
            Edit
          </span>
        </div>
        <CSSTransition timeout={150} in={isOpenEditIcon} classNames="container-transition">
          <>
            {isOpenEditIcon && (
              <div className="edit-workspace-icon">
                <p className="mini-paragraph">Background color</p>
                <div>
                  {colors.map((color: string) => (
                    <div onClick={() => handleChange(color, 'color')} style={{ backgroundColor: color }} className="color-option" key={color}>
                      {color === currentWorkspace.color && <Check />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        </CSSTransition>
        <div className="workspace-info">
          <h3 contentEditable suppressContentEditableWarning onBlur={(event) => handleChange(event.target.innerText, 'name')}>
            {currentWorkspace.name}
          </h3>
          <p contentEditable suppressContentEditableWarning className="mini-paragraph" onBlur={(event) => handleChange(event.target.innerText, 'description')}>
            {currentWorkspace.description}
          </p>
        </div>
      </section>
      <section className="workspace-tabs">
        <TabsContext>
          <TabList>
            <Tab>Boards</Tab>
            <Tab>Members</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="recent-boards">
              {!!sortedBoardsByRecentlyVisited?.length && (
                <ul>
                  {sortedBoardsByRecentlyVisited?.map((board: Board) => (
                    <>
                      <li key={board.id} onClick={() => onNavigateBoard(board)}>
                        <span>
                          {<Board />} {board.name}
                        </span>{' '}
                        {<Favorite />}
                      </li>
                      <hr />
                    </>
                  ))}
                </ul>
              )}
            </TabPanel>
            <TabPanel>Second slide</TabPanel>
          </TabPanels>
        </TabsContext>
      </section>
    </main>
  )
}
